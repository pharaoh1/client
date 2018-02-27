package libkb

import (
	keybase1 "github.com/keybase/client/go/protocol/keybase1"
	jsonw "github.com/keybase/go-jsonw"
	context "golang.org/x/net/context"
)

func importResetChainFromJSON(ctx context.Context, g *GlobalContext, jw *jsonw.Wrapper) (rc *keybase1.ResetChain, err error) {
	defer g.CVTrace(ctx, VLog0, "importResetChainFromJSON", func() error { return err })()
	if jw == nil || jw.IsNil() {
		return nil, nil
	}
	var tmp keybase1.ResetChain
	err = jw.UnmarshalAgain(&tmp)
	if err == nil {
		rc = &tmp
	}
	return rc, err
}
